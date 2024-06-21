compile-cpp:
	g++ \
		-std=c++14 \
		-o main \
		main.cpp \
		-I/opt/homebrew/Cellar/boost/1.85.0/include
compile-cpp-wasm:
	em++ \
		-std=c++14 \
		-O3 \
		-sEXPORTED_FUNCTIONS=_betaPDF,_betaPDFAtMode \
		-sEXPORTED_RUNTIME_METHODS=cwrap \
		-o boost.js \
		main.cpp \
		-I/opt/homebrew/Cellar/boost/1.85.0/include