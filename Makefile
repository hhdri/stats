compile-cpp:
	g++ -std=c++14 -o main main.cpp -I/opt/homebrew/Cellar/boost/1.85.0/include -L/opt/homebrew/Cellar/boost/1.85.0/lib -lboost_math_c99
compile-cpp-wasm:
	em++ -std=c++14 -s EXPORTED_FUNCTIONS='["_betaPDF", "_betaPPF", "_betaPDFAtMode"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "getValue", "setValue"]' -o boost.js main.cpp -I/opt/homebrew/Cellar/boost/1.85.0/include -L/opt/homebrew/Cellar/boost/1.85.0/lib -lboost_math_c99