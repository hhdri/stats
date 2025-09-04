compile-cpp:
	g++ \
		-std=c++14 \
		-o main \
		main.cpp
compile-cpp-wasm:
	em++ \
		-std=c++14 \
		-O3 \
		--use-port=boost_headers \
		-s EXPORTED_FUNCTIONS='["_betaPDF","_betaPDFAtMode","_betaPDFVector","_malloc","_free"]' \
		-s EXPORTED_RUNTIME_METHODS='["cwrap","setValue","getValue"]' \
		-s USE_CLOSURE_COMPILER=1 \
		-o boost.js \
		main.cpp