document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  const executeBtn = document.getElementById("execute");
  const resetBtn = document.getElementById("reset");
  const consoleOutput = document.querySelector("#console code");

  const originalConsoleLog = console.log;
  console.log = (...args) => {
    consoleOutput.innerHTML += args.join(" ") + "<br>";
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
});
