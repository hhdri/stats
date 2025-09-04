// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
/** @type{Object} */var Module;// if (!Module)` is crucial for Closure Compiler here as it will otherwise replace every `Module` occurrence with a string
if(!Module)/** @suppress{checkTypes}*/Module=typeof Module != 'undefined' ? Module : {};// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof WorkerGlobalScope!="undefined";// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE=typeof process=="object"&&process.versions?.node&&process.type!="renderer";// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};// In MODULARIZE mode _scriptName needs to be captured already at the very top of the page immediately when the page is parsed, so it is generated there
// before the page load. In non-MODULARIZE modes generate it here.
var _scriptName=typeof document!="undefined"?document.currentScript?.src:undefined;if(typeof __filename!="undefined"){// Node
_scriptName=__filename}else if(ENVIRONMENT_IS_WORKER){_scriptName=self.location.href}// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}// Hooks that are implemented differently in different runtime environments.
var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){// These modules will usually be used on Node.js. Load them eagerly to avoid
// the complexity of lazy-loading.
var fs=require("fs");scriptDirectory=__dirname+"/";// include: node_shell_read.js
readBinary=filename=>{// We need to re-wrap `file://` strings to URLs.
filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename);return ret};readAsync=async(filename,binary=true)=>{// See the comment in the `readBinary` function.
filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename,binary?undefined:"utf8");return ret};// end include: node_shell_read.js
if(process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);// MODULARIZE will export the module in the proper place outside, we don't need to export here
if(typeof module!="undefined"){module["exports"]=Module}quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow}}else// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){try{scriptDirectory=new URL(".",_scriptName).href}catch{}{// include: web_or_worker_shell_read.js
if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response))}}readAsync=async url=>{// Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
// See https://github.com/github/fetch/pull/92#issuecomment-140665932
// Cordova or Electron apps are typically loaded from a file:// url.
// So use XHR on webview if URL is a file URL.
if(isFileURI(url)){return new Promise((resolve,reject)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||(xhr.status==0&&xhr.response)){// file URLs can return 0
resolve(xhr.response);return}reject(xhr.status)};xhr.onerror=reject;xhr.send(null)})}var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{}var out=console.log.bind(console);var err=console.error.bind(console);// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary;// Wasm globals
//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT=false;/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */var isFileURI=filename=>filename.startsWith("file://");// include: runtime_common.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
// Memory management
var wasmMemory;var/** @type {!Int8Array} */HEAP8,/** @type {!Uint8Array} */HEAPU8,/** @type {!Int16Array} */HEAP16,/** @type {!Uint16Array} */HEAPU16,/** @type {!Int32Array} */HEAP32,/** @type {!Uint32Array} */HEAPU32,/** @type {!Float32Array} */HEAPF32,/** @type {!Float64Array} */HEAPF64;// BigInt64Array type is not correctly defined in closure
var/** not-@type {!BigInt64Array} */HEAP64,/* BigUint64Array type is not correctly defined in closure
/** not-@type {!BigUint64Array} */HEAPU64;var runtimeInitialized=false;function updateMemoryViews(){var b=wasmMemory.buffer;HEAP8=new Int8Array(b);HEAP16=new Int16Array(b);HEAPU8=new Uint8Array(b);HEAPU16=new Uint16Array(b);HEAP32=new Int32Array(b);HEAPU32=new Uint32Array(b);HEAPF32=new Float32Array(b);HEAPF64=new Float64Array(b);HEAP64=new BigInt64Array(b);HEAPU64=new BigUint64Array(b)}// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}// Begin ATPRERUNS hooks
callRuntimeCallbacks(onPreRuns)}function initRuntime(){runtimeInitialized=true;// No ATINITS hooks
wasmExports["h"]()}function postRun(){// PThreads reuse the runtime from the main thread.
if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}// Begin ATPOSTRUNS hooks
callRuntimeCallbacks(onPostRuns)}/** @param {string|number=} what */function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";// TODO(sbc): Should we remove printing and leave it up to whoever
// catches the exception?
err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";// Use a wasm runtime error, because a JS error might be seen as a foreign
// exception, which means we'd run destructors on it. We need the error to
// simply make the program stop.
// FIXME This approach does not work in Wasm EH because it currently does not assume
// all RuntimeErrors are from traps; it decides whether a RuntimeError is from
// a trap or not based on a hidden field within the object. So at the moment
// we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
// allows this in the wasm spec.
// Suppress closure compiler warning here. Closure compiler's builtin extern
// definition for WebAssembly.RuntimeError claims it takes no arguments even
// though it can.
// TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
/** @suppress {checkTypes} */var e=new WebAssembly.RuntimeError(what);// Throw the error whether or not MODULARIZE is set because abort is used
// in code paths apart from instantiation where an exception is expected
// to be thrown when abort is called.
throw e}var wasmBinaryFile;function findWasmBinary(){return locateFile("boost.wasm")}function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){// If we don't have the binary yet, load it asynchronously using readAsync.
if(!wasmBinary){// Fetch the binary using readAsync
try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}// Otherwise, getBinarySync should be able to get it synchronously
return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary&&!isFileURI(binaryFile)&&!ENVIRONMENT_IS_NODE){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){// We expect the most common failure cause to be a bad MIME type for the binary,
// in which case falling back to ArrayBuffer instantiation should work.
err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){// prepare imports
return{"a":wasmImports}}// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm(){// Load the wasm module and create an instance of using native support in the JS engine.
// handle a generated wasm instance, receiving its exports and
// performing other necessary setup
/** @param {WebAssembly.Module=} module*/function receiveInstance(instance,module){wasmExports=instance.exports;wasmMemory=wasmExports["g"];updateMemoryViews();assignWasmExports(wasmExports);removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");// Prefer streaming instantiation if available.
function receiveInstantiationResult(result){// 'result' is a ResultObject object which has both the module and instance.
// receiveInstance() will swap in the exports (to Module.asm) so they can be called
// TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
// When the regression is fixed, can restore the above PTHREADS-enabled path.
return receiveInstance(result["instance"])}var info=getWasmImports();// User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
// to manually instantiate the Wasm module themselves. This allows pages to
// run the instantiation parallel to any other async startup actions they are
// performing.
// Also pthreads and wasm workers initialize the wasm instance through this
// path.
if(Module["instantiateWasm"]){return new Promise((resolve,reject)=>{Module["instantiateWasm"](info,(mod,inst)=>{resolve(receiveInstance(mod,inst))})})}wasmBinaryFile??=findWasmBinary();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}// end include: preamble.js
// Begin JS library code
class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){// Pass the module as the first argument.
callbacks.shift()(Module)}};var onPostRuns=[];var addOnPostRun=cb=>onPostRuns.push(cb);var onPreRuns=[];var addOnPreRun=cb=>onPreRuns.push(cb);var runDependencies=0;var dependenciesFulfilled=null;var removeRunDependency=id=>{runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}};var addRunDependency=id=>{runDependencies++;Module["monitorRunDependencies"]?.(runDependencies)};/**
     * @param {number} ptr
     * @param {string} type
     */function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr];case"i8":return HEAP8[ptr];case"i16":return HEAP16[((ptr)>>1)];case"i32":return HEAP32[((ptr)>>2)];case"i64":return HEAP64[((ptr)>>3)];case"float":return HEAPF32[((ptr)>>2)];case"double":return HEAPF64[((ptr)>>3)];case"*":return HEAPU32[((ptr)>>2)];default:abort(`invalid type for getValue: ${type}`)}}var noExitRuntime=true;/**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr]=value;break;case"i8":HEAP8[ptr]=value;break;case"i16":HEAP16[((ptr)>>1)]=value;break;case"i32":HEAP32[((ptr)>>2)]=value;break;case"i64":HEAP64[((ptr)>>3)]=BigInt(value);break;case"float":HEAPF32[((ptr)>>2)]=value;break;case"double":HEAPF64[((ptr)>>3)]=value;break;case"*":HEAPU32[((ptr)>>2)]=value;break;default:abort(`invalid type for setValue: ${type}`)}}var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder:undefined;var findStringEnd=(heapOrArray,idx,maxBytesToRead,ignoreNul)=>{var maxIdx=idx+maxBytesToRead;if(ignoreNul)return maxIdx;// TextDecoder needs to know the byte length in advance, it doesn't stop on
// null terminator by itself.
// As a tiny code save trick, compare idx against maxIdx using a negation,
// so that maxBytesToRead=undefined/NaN means Infinity.
while(heapOrArray[idx]&&!(idx>=maxIdx))++idx;return idx};/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */var UTF8ArrayToString=(heapOrArray,idx=0,maxBytesToRead,ignoreNul)=>{var endPtr=findStringEnd(heapOrArray,idx,maxBytesToRead,ignoreNul);// When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){// For UTF8 byte structure, see:
// http://en.wikipedia.org/wiki/UTF-8#Description
// https://www.ietf.org/rfc/rfc2279.txt
// https://tools.ietf.org/html/rfc3629
var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode(((u0&31)<<6)|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=((u0&15)<<12)|(u1<<6)|u2}else{u0=((u0&7)<<18)|(u1<<12)|(u2<<6)|(heapOrArray[idx++]&63)}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|(ch>>10),56320|(ch&1023))}}return str};/**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index.
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */var UTF8ToString=(ptr,maxBytesToRead,ignoreNul)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead,ignoreNul):"";var ___assert_fail=(condition,filename,line,func)=>abort(`Assertion failed: ${UTF8ToString(condition)}, at: `+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"]);class ExceptionInfo{// excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[(((this.ptr)+(4))>>2)]=type}get_type(){return HEAPU32[(((this.ptr)+(4))>>2)]}set_destructor(destructor){HEAPU32[(((this.ptr)+(8))>>2)]=destructor}get_destructor(){return HEAPU32[(((this.ptr)+(8))>>2)]}set_caught(caught){caught=caught?1:0;HEAP8[(this.ptr)+(12)]=caught}get_caught(){return HEAP8[(this.ptr)+(12)]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[(this.ptr)+(13)]=rethrown}get_rethrown(){return HEAP8[(this.ptr)+(13)]!=0}// Initialize native structure fields. Should be called once after allocated.
init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[(((this.ptr)+(16))>>2)]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[(((this.ptr)+(16))>>2)]}}var exceptionLast=0;var uncaughtExceptionCount=0;var ___cxa_throw=(ptr,type,destructor)=>{var info=new ExceptionInfo(ptr);// Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw exceptionLast};var __abort_js=()=>abort("");var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{// Parameter maxBytesToWrite is not optional. Negative values, 0, null,
// undefined and false each don't write out any bytes.
if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;// -1 for string null terminator.
for(var i=0;i<str.length;++i){// For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
// and https://www.ietf.org/rfc/rfc2279.txt
// and https://tools.ietf.org/html/rfc3629
var u=str.codePointAt(i);if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|(u>>6);heap[outIdx++]=128|(u&63)}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|(u>>12);heap[outIdx++]=128|((u>>6)&63);heap[outIdx++]=128|(u&63)}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|(u>>18);heap[outIdx++]=128|((u>>12)&63);heap[outIdx++]=128|((u>>6)&63);heap[outIdx++]=128|(u&63);// Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
// We need to manually skip over the second code unit for correct iteration.
i++}}// Null-terminate the pointer to the buffer.
heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var abortOnCannotGrowMemory=requestedSize=>{abort("OOM")};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;// With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
requestedSize>>>=0;abortOnCannotGrowMemory(requestedSize)};var ENV={};var getExecutableName=()=>thisProgram||"./this.program";var getEnvStrings=()=>{if(!getEnvStrings.strings){// Default values.
// Browser language detection #8751
var lang=((typeof navigator=="object"&&navigator.language)||"C").replace("-","_")+".UTF-8";var env={"USER":"web_user","LOGNAME":"web_user","PATH":"/","PWD":"/","HOME":"/home/web_user","LANG":lang,"_":getExecutableName()};// Apply the user-provided values, if any.
for(var x in ENV){// x is a key in ENV; if ENV[x] is undefined, that means it was
// explicitly set to be so. We allow user code to do that to
// force variables with default values to remain unset.
if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(`${x}=${env[x]}`)}getEnvStrings.strings=strings}return getEnvStrings.strings};var _environ_get=(__environ,environ_buf)=>{var bufSize=0;var envp=0;for(var string of getEnvStrings()){var ptr=environ_buf+bufSize;HEAPU32[(((__environ)+(envp))>>2)]=ptr;bufSize+=stringToUTF8(string,ptr,Infinity)+1;envp+=4}return 0};var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){// Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
// unit, not a Unicode code point of the character! So decode
// UTF16->UTF32->UTF8.
// See http://unicode.org/faq/utf_bom.html#utf16-3
var c=str.charCodeAt(i);// possibly a lead surrogate
if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var _environ_sizes_get=(penviron_count,penviron_buf_size)=>{var strings=getEnvStrings();HEAPU32[((penviron_count)>>2)]=strings.length;var bufSize=0;for(var string of strings){bufSize+=lengthBytesUTF8(string)+1}HEAPU32[((penviron_buf_size)>>2)]=bufSize;return 0};var getCFunc=ident=>{var func=Module["_"+ident];// closure exported function
return func};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer)};var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};/**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Array=} args
     * @param {Object=} opts
     */var ccall=(ident,returnType,argTypes,args,opts)=>{// For fast lookup of conversion functions
var toC={"string":str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){// null string
ret=stringToUTF8OnStack(str)}return ret},"array":arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};/**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */var cwrap=(ident,returnType,argTypes,opts)=>{// When the function takes numbers and returns a number, we can just return
// the original function
var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(...args)=>ccall(ident,returnType,argTypes,args,opts)};// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{// Begin ATMODULES hooks
if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(Module["print"])out=Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];// End ATMODULES hooks
if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].shift()()}}}// Begin runtime exports
Module["cwrap"]=cwrap;Module["setValue"]=setValue;Module["getValue"]=getValue;// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
// Imports from the Wasm binary.
var _betaPDF,_betaPDFAtMode,_betaPDFVector,_malloc,_free,__emscripten_stack_restore,__emscripten_stack_alloc,_emscripten_stack_get_current;function assignWasmExports(wasmExports){Module["_betaPDF"]=_betaPDF=wasmExports["i"];Module["_betaPDFAtMode"]=_betaPDFAtMode=wasmExports["j"];Module["_betaPDFVector"]=_betaPDFVector=wasmExports["k"];Module["_malloc"]=_malloc=wasmExports["l"];Module["_free"]=_free=wasmExports["m"];__emscripten_stack_restore=wasmExports["n"];__emscripten_stack_alloc=wasmExports["o"];_emscripten_stack_get_current=wasmExports["p"]}var wasmImports={/** @export */b:___assert_fail,/** @export */a:___cxa_throw,/** @export */e:__abort_js,/** @export */f:_emscripten_resize_heap,/** @export */c:_environ_get,/** @export */d:_environ_sizes_get};// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
function run(){if(runDependencies>0){dependenciesFulfilled=run;return}preRun();// a preRun added a dependency, run will be called later
if(runDependencies>0){dependenciesFulfilled=run;return}function doRun(){// run may have just been called through dependencies being fulfilled just in this very frame,
// or while the async setStatus time below was happening
Module["calledRun"]=true;if(ABORT)return;initRuntime();Module["onRuntimeInitialized"]?.();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(()=>{setTimeout(()=>Module["setStatus"](""),1);doRun()},1)}else{doRun()}}var wasmExports;// With async instantation wasmExports is assigned asynchronously when the
// instance is received.
createWasm();run();
