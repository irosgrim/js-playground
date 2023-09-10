// if you want to pass code to the iframe: <iframe src="the-editor.com?code=btoa-encoded-string" 
document.addEventListener("DOMContentLoaded", () => {
  const consoleOutput = document.querySelector("#console code");
  const urlParams = new URLSearchParams(window.location.search);
  const encodedCode = urlParams.get("code");
  const theme = urlParams.get("theme");
  let initialTheme = "";
  let initialCode = `// pass query param theme=dark or theme=light to change theme
console.log("Hello world!");
  `;

  switch(theme) {
    case "dark":
      initialTheme = "nord";
      document.body.classList.add("dark");
      break;
    default:
    case "light":
      initialTheme = "mdn-like";
      document.body.classList.add("light");
      break;
  }

  if (encodedCode) {
    initialCode = atob(encodedCode);
  }

  const editor = CodeMirror(document.querySelector('#editor'), {
      lineNumbers: true,
      tabSize: 2,
      value: initialCode,
      mode: "javascript",
      theme: initialTheme,
      autoCloseBrackets: true,
  });

  const toConsoleString = (value) => {
    if (Array.isArray(value)) {
      const arrItems = value.map(toConsoleString);
      return `(${arrItems.length}) [${arrItems.join(", ")}]`;
    }
    if (typeof value === "object" && value !== null) {
      const objItems = Object.entries(value)
        .map(([k, v]) => {
          const val = (typeof v === "string") ? `'${toConsoleString(v)}'` : toConsoleString(v);
          return `${k}: ${val}`;
        });
      return `{${objItems.join(", ")}}`;
    }
    if (typeof value === "string") {
      return value;
    } 
    if (typeof value === "function") {
      return "ƒ: " + value;
    }
      return String(value);
}

  const originalConsoleLog = console.log;
  console.log = (...args) => {
    const formattedArgs = args.map(toConsoleString).join(" ");
    consoleOutput.innerHTML += formattedArgs + "<br>";
    originalConsoleLog.apply(console, args);
  };

  const executeCode = (value) => {
    consoleOutput.innerHTML = "";
    try {
      new Function(value)();
    } catch (error) {
      consoleOutput.innerHTML = '<strong class="error">Error:: </strong>' + error.message;
    }
    consoleOutput.classList.add("fade-in");
    consoleOutput.addEventListener("animationend", () =>{
      consoleOutput.classList.remove("fade-in");
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.id === "execute") {
        executeCode(editor.getValue());
        return;
    }
    if (e.target.id === "reset") {
        consoleOutput.innerHTML = "";
        return;
    }
  });

  editor.on("keyup",(c, e) => {
    const currValue = editor.getValue();
    if(currValue.length) {
      const encodedCode = btoa(currValue);
      urlParams.set("code", encodedCode);
      window.history.replaceState({}, "", '?' + urlParams.toString());
    }
  });
});
