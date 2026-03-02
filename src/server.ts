import { Config } from "./config/index.js";

console.log(">>>>>>>>>>>>>>>server js data")

function welcome(name: string){
  console.log(`Welcome ${name}!`, Config);
}

welcome("hello")