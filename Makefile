all:
	g++ -std=c++17 reconhecimento.cpp -o reconhecimento -I/usr/include/opencv4 -L/usr/lib64 -lopencv_core -lopencv_face -lopencv_objdetect -lopencv_imgproc -lopencv_highgui -lopencv_videoio -lopencv_imgcodecs
clear:
	reconhecimento