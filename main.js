$(document).ready(function () {
  /* editor for instruction code */
  var editorInstructionCode = Editor.get("editor-instruction-code", {
      mode: "ace/mode/javascript",
      theme: "ace/theme/github",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 150
    }
  );

  var editorStartCode = Editor.get("editor-start-code", {
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 0
    }
  );

  /* editor for output */
  var editorUserOutput = Editor.get("editor-user-output", {
      mode: "ace/mode/text",
      theme: "ace/theme/tomorrow_night_blue",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 50
    }
  );

  var editorSolutionOutput = Editor.get("editor-solution-output", {
      mode: "ace/mode/text",
      theme: "ace/theme/tomorrow_night_blue",
      highlightActiveLine: false,
      readOnly: true,
      maxLines: 50
    }
  );

  /* editor for code */
  var editorUserInput;
  var editorSolutionCode;


  var levelFile = 'level1.html';


  /* dynamically load content */
  Editor.loadContent(editorInstructionCode, "level/" + levelFile, "editor-instruction-code", function () {
    /* editor for code */
    editorUserInput = Editor.get("editor-user-input", {
        mode: "ace/mode/javascript",
        theme: "ace/theme/github",
        firstLineNumber: editorInstructionCode.session.getLength() + 1,
        maxLines: 150
      }
    );

    editorSolutionCode = Editor.get("editor-solution-code", {
        mode: "ace/mode/javascript",
        theme: "ace/theme/github",
        highlightActiveLine: false,
        readOnly: true,
        firstLineNumber: editorInstructionCode.session.getLength() + 1,
        maxLines: 150
      }
    );

    Editor.loadContent(editorSolutionCode, "level/" + levelFile, "editor-solution-code");
  });

  Editor.loadContent(editorStartCode, "level/" + levelFile, "editor-start-code");
  $("h1").load("level/" + levelFile + " .level-title");
  $("div.instruction").load("level/" + levelFile + " .level-instruction");

  var tries = 0;

  $("#btn-eval").on("click", function () {
    var isDisplaySolution = false;

    if (!Editor.hasCodeLines(editorUserInput))
      return;

    $(this).prop("disabled", true);

    if (Editor.hasSyntaxErrors(editorUserInput)) {
      editorUserOutput.session.setValue("Dein Code enthält Syntax-Fehler!");
    }
    else {
        var resultUserInput = Editor.execJS(editorStartCode, editorUserInput);
        var resultSolutionCode = Editor.execJS(editorStartCode, editorSolutionCode);

        var outputHeader;
        if (compareArray(resultUserInput, resultSolutionCode)) {
          isDisplaySolution = true;
          outputHeader = "Du hast es geschafft!";
        }
        else {
          outputHeader = "Deine Programmausgabe ist nicht richtig!";
        }

        if (resultUserInput)
          editorUserOutput.session.setValue([outputHeader].concat(resultUserInput).join("\n"));

        if (resultSolutionCode)
          editorSolutionOutput.session.setValue(["Lösung:"].concat(resultSolutionCode).join("\n"));
    }

    $("#editor-user-output").fadeIn("slow");

    if (++tries > 0) isDisplaySolution = true;
    if (isDisplaySolution) $("#btn-solve").fadeIn("slow");

    $(this).prop("disabled", false);
  });

  $("#btn-solve").on("click", function () {
    $(this).fadeOut("slow");
    $("pre.editor.solution").fadeIn("slow");
  });
});