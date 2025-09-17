# Beta percentile and densities in browser using C++ and WebAssembly
This is a minimal example of how to compute beta percentiles and densities in the browser using C++ and WebAssembly. It uses the Boost C++ libraries for the statistical computations.
The example includes a simple C++ program that computes the beta percentiles and densities, and a Makefile to compile the program to WebAssembly using Emscripten.
To compile the C++ code to WebAssembly, you need to have Emscripten installed. You can follow the instructions on the [Emscripten website](https://emscripten.org/docs/getting_started/downloads.html) to set it up.
Once you have Emscripten installed, you can use the provided Makefile to compile the C++ code to WebAssembly. Simply run the following command in the terminal:
```bash
make compile-cpp-wasm
```
This will generate a `boost.js` file that you can include in your HTML file to use the compiled WebAssembly code.
The HTML file includes a simple interface to input the parameters for the beta distribution and displays the computed percentiles and densities.
You can open the `index.html` file in a web browser to see the example in action.
Feel free to modify the C++ code and the HTML file to suit your needs!