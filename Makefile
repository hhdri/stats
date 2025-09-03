compile-cpp:
	g++ \
		-std=c++14 \
		-o main \
		main.cpp
compile-cpp-wasm:
	em++ \
		-std=c++14 \
		-O3 \
		-sEXPORTED_FUNCTIONS=_betaPDF,_betaPDFAtMode \
		-sEXPORTED_RUNTIME_METHODS=cwrap \
		-s USE_CLOSURE_COMPILER=1 \
		-o boost.js \
		main.cpp