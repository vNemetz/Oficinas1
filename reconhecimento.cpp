#include <opencv2/opencv.hpp>
#include <opencv2/objdetect.hpp>
#include <opencv2/face.hpp>
#include <iostream>
#include <fstream> 
#include <vector>
#include <filesystem>

using namespace cv;
using namespace std;
using namespace cv::face;
namespace fs = std::filesystem;

// Função para capturar e salvar múltiplas imagens de um rosto
void salvarRostosNaBase(VideoCapture& capture, Ptr<LBPHFaceRecognizer>& recognizer, string folderPath) {
    vector<Mat> imagens;
    vector<int> labels;

    CascadeClassifier face_cascade;
    if (!face_cascade.load("haarcascade_frontalface_default.xml")) {
        cerr << "Erro ao carregar o classificador Haar Cascade!" << endl;
        return;
    }

    // Verificar se a pasta existe, senão, criar a pasta
    if (!fs::exists(folderPath)) {
        fs::create_directory(folderPath);  // Cria a pasta se não existir
    }

    // Obter o próximo ID baseado nas imagens existentes
    int id = 1;
    for (const auto& entry : fs::directory_iterator(folderPath)) {
        string filename = entry.path().string();
        if (filename.find("face_") != string::npos) {
            size_t start = filename.find("face_") + 5;
            size_t end = filename.find(".jpg");
            string idStr = filename.substr(start, end - start);
            int fileId = stoi(idStr);
            id = max(id, fileId + 1);
        }
    }

    cout << "Por favor, olhe para a câmera. Pressione 'ESC' para capturar as fotos." << endl;

    // Ajustes do LBPH
    recognizer->setRadius(3);  // Ajuste do raio para maior robustez
    recognizer->setNeighbors(16);  // Aumentar número de vizinhos para maior precisão
    recognizer->setGridX(8);  // Ajuste das colunas
    recognizer->setGridY(8);  // Ajuste das linhas

    int numFotos = 0;
    while (numFotos < 30) {  // Captura 30 fotos para treinamento
        Mat frame;
        capture >> frame;
        if (frame.empty()) {
            cerr << "Erro ao capturar imagem!" << endl;
            break;
        }

        vector<Rect> faces;
        // Ajuste dos parâmetros para uma detecção mais precisa e evitar deteções falsas
        face_cascade.detectMultiScale(frame, faces, 1.1, 3, 0 | CASCADE_SCALE_IMAGE, Size(30, 30));

        if (faces.size() > 0) {
            Rect face = faces[0];
            rectangle(frame, face, Scalar(0, 255, 0), 2);

            Mat faceROI = frame(face);
            Mat gray, equalized;
            cvtColor(faceROI, gray, COLOR_BGR2GRAY);
            
            // Aplicando suavização para reduzir o impacto de variações de luz
            GaussianBlur(gray, gray, Size(5, 5), 0);
            
            equalizeHist(gray, equalized);  // Equalização de histograma para melhorar a imagem

            // Exibe a imagem enquanto captura
            imshow("Cadastro de Rosto", frame);

            // Salva a foto quando a tecla 'ESC' é pressionada
            string filename = folderPath + "/face_" + to_string(id) + "_" + to_string(numFotos) + ".jpg";
            bool saved = imwrite(filename, equalized);

            if (saved) {
                cout << "Imagem de rosto salva em: " << filename << endl;
                imagens.push_back(equalized);
                labels.push_back(id);  // Atribuir um ID ao rosto
                numFotos++;
            } else {
                cerr << "Erro ao salvar a imagem de rosto: " << filename << endl;
            }
        }

        waitKey(1);  // Pequeno delay para permitir captura de rostos
    }

    // Treinar o reconhecedor com as imagens capturadas
    if (!imagens.empty()) {
        recognizer->train(imagens, labels);
        recognizer->save("modelo_reconhecimento.yml");  // Salvar o modelo treinado
        cout << "Modelo treinado e salvo!" << endl;
    } else {
        cerr << "Nenhuma imagem de rosto foi salva para treinamento!" << endl;
    }
}

// Função para reconhecer rostos a partir do modelo treinado
void reconhecerRostos(VideoCapture& capture, Ptr<LBPHFaceRecognizer>& recognizer) {
    CascadeClassifier face_cascade;
    if (!face_cascade.load("haarcascade_frontalface_default.xml")) {
        cerr << "Erro ao carregar o classificador Haar Cascade!" << endl;
        return;
    }

    vector<Rect> faces;
    Mat frame;

    while (true) {
        capture >> frame;
        if (frame.empty()) {
            cerr << "Erro ao capturar imagem!" << endl;
            break;
        }

        // Ajuste dos parâmetros para uma detecção mais precisa e evitar deteções falsas
        face_cascade.detectMultiScale(frame, faces, 1.1, 3, 0 | CASCADE_SCALE_IMAGE, Size(30, 30));

        if (faces.size() > 0) {
            Rect face = faces[0];
            Mat faceROI = frame(face);

            Mat gray, equalized;
            cvtColor(faceROI, gray, COLOR_BGR2GRAY);
            equalizeHist(gray, equalized);  // Equalização de histograma

            // Aplicando suavização para reduzir variações de iluminação
            GaussianBlur(equalized, equalized, Size(5, 5), 0);

            int label;
            double confidence;
            recognizer->predict(equalized, label, confidence);

            // Ajustar a rigidez: permitir maior flexibilidade para variações de luz
            if (confidence < 120) {  // Limite ajustado para maior flexibilidade
                putText(frame, "ID: " + to_string(label), Point(face.x, face.y - 10), FONT_HERSHEY_SIMPLEX, 1, Scalar(0, 255, 0), 2);
                rectangle(frame, face, Scalar(0, 255, 0), 2);

                
                /*ofstream serial("/dev/ttyUSB0"); // Porta serial (verifique qual porta está em uso)
                if (serial.is_open()) {
                    serial << "GIRAR"; // Comando para o Arduino
                    serial.close();
                }*/
                

            } else {
                putText(frame, "Desconhecido", Point(face.x, face.y - 10), FONT_HERSHEY_SIMPLEX, 1, Scalar(0, 0, 255), 2);
                rectangle(frame, face, Scalar(0, 0, 255), 2);
            }
        }

        imshow("Reconhecimento Facial", frame);

        if (waitKey(1) == 27) {
            break;  // 27 é a tecla 'Esc'
        }
    }
}

int main() {
    VideoCapture capture(0);
    if (!capture.isOpened()) {
        cerr << "Erro ao abrir a câmera!" << endl;
        return -1;
    }

    Ptr<LBPHFaceRecognizer> recognizer = LBPHFaceRecognizer::create();

    cout << "Escolha uma opção: \n1 - Cadastrar rosto\n2 - Reconhecer rostos\n";
    int opcao;
    cin >> opcao;

    if (opcao == 1) {
        salvarRostosNaBase(capture, recognizer, "base_de_dados");
    } else if (opcao == 2) {
        try {
            recognizer->read("modelo_reconhecimento.yml");
            cout << "Modelo carregado com sucesso!" << endl;
            reconhecerRostos(capture, recognizer);
        } catch (const cv::Exception& e) {
            cerr << "Erro ao carregar o modelo: " << e.what() << endl;
        }
    } else {
        cerr << "Opção inválida!" << endl;
    }

    capture.release();
    destroyAllWindows();

    return 0;
}