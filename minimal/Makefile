compile-cpp:
	g++ -o main main.cpp
compile-cpp-wasm:
	em++ \
		--use-port=boost_headers \
		-s EXPORTED_FUNCTIONS='["_betaPercentileDensities","_malloc","_free"]' \
		-s EXPORTED_RUNTIME_METHODS='["cwrap","getValue"]' \
		-o boost.js \
		main.cpp