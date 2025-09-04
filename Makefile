compile-cpp:
	g++ \
		-O3 \
		-std=c++14 \
		-o main \
		main.cpp
compile-cpp-wasm:
	em++ \
		-std=c++14 \
		-O3 \
		--use-port=boost_headers \
		-s EXPORTED_FUNCTIONS='["_betaPercentileDensities","_malloc"]' \
		-s EXPORTED_RUNTIME_METHODS='["cwrap","getValue"]' \
		-o boost.js \
		main.cpp