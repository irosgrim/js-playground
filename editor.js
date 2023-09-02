// if you want to pass code to the iframe: <iframe src="the-editor.com?code=btoa-encoded-string" 
document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  const consoleOutput = document.querySelector("#console code");
  const urlParams = new URLSearchParams(window.location.search);
  const encodedCode = urlParams.get('code');
  let initialCode = `console.log("Hello world!");`;

  if (encodedCode) {
    initialCode = atob(encodedCode);
  }

  editor.value = initialCode;

  const toConsoleString = (value) => {
    if (Array.isArray(value)) {
      const arrItems = value.map(toConsoleString);
      return `[${arrItems.join(", ")}]`;
    } else if (typeof value === "object" && value !== null) {
      const objItems = Object.entries(value)
        .map(([k, v]) => `${k}: ${toConsoleString(v)}`);
      return `{${objItems.join(", ")}}`;
    } else if (typeof value === "string") {
      return value;
    } else {
      return String(value);
    }
}

const originalConsoleLog = console.log;
console.log = (...args) => {
  const formattedArgs = args.map(toConsoleString).join(" ");
  consoleOutput.innerHTML += formattedArgs + "<br>";
  originalConsoleLog.apply(console, args);
};



  const executeCode = () => {
    consoleOutput.innerHTML = "";
    try {
      new Function(editor.value)();
    } catch (error) {
      consoleOutput.innerHTML = "<strong>Error:: </strong>" + error.message;
    }
    consoleOutput.classList.add("fade-in");
    consoleOutput.addEventListener("animationend", () =>{
      consoleOutput.classList.remove("fade-in");
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.id === "execute") {
        executeCode();
        return;
    }
    if (e.target.id === "reset") {
        consoleOutput.innerHTML = "";
        return;
    }
  });

  editor.addEventListener("keyup", (e) => {
    if(e.target.value.length) {
      const encodedCode = btoa(e.target.value);
      urlParams.set("code", encodedCode);
      window.history.replaceState({}, "", '?' + urlParams.toString());
    }
  })
});
