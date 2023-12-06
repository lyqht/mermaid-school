"use client";

import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { TypedLiveblocksProvider, useRoom } from "@/liveblocks.config";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./CollaborativeEditor.module.css";
import { Avatars } from "@/components/Avatars";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { Cursors } from "@/components/Cursors";
import { Toolbar } from "@/components/Toolbar";
import mermaid from "mermaid";

// Collaborative code editor with undo/redo, live cursors, and live avatars
export function CollaborativeEditor() {
  mermaid.initialize({ startOnLoad: false });

  const room = useRoom();
  const [provider, setProvider] = useState<TypedLiveblocksProvider>();
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();

  useEffect(() => {
    // Set up Liveblocks Yjs provider and attach Monaco editor
    let yProvider: TypedLiveblocksProvider;
    let yDoc: Y.Doc;
    let binding: MonacoBinding;

    if (editorRef) {
      yDoc = new Y.Doc();
      const yText = yDoc.getText("monaco");
      yProvider = new LiveblocksProvider(room, yDoc);
      setProvider(yProvider);

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel() as editor.ITextModel,
        new Set([editorRef]),
        yProvider.awareness as Awareness
      );
    }

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
    };
  }, [editorRef, room]);

  const [editorText, setEditorText] = useState("");
  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);

    e.onDidChangeModelContent(() => {
      setEditorText(e.getValue());
    });
  }, []);

  /* --------------------- */
  /* --- MERMAID LOGIC --- */
  /* --------------------- */
  const [mermaidTextHistory, setMermaidTextHistory] = useState<string[]>([]);
  const [mermaidText, setMermaidText] = useState("");
  const [isMermaidSyntaxValid, setIsMermaidSyntaxValid] = useState(false);

  const validateMermaidText = async () => {
    return await mermaid.parse(editorText);
  };
  const handleMermaidTextChange = () => {
    if (editorText.length === 0) {
      return;
    }

    const fallbackText =
      mermaidTextHistory.length === 0
        ? ""
        : mermaidTextHistory[mermaidTextHistory.length - 1];
    validateMermaidText()
      .then((valid) => {
        if (valid) {
          setIsMermaidSyntaxValid(true);
          mermaidTextHistory.push(editorText);
          setMermaidText(editorText);
        } else {
          setIsMermaidSyntaxValid(false);
          setMermaidText(fallbackText);
        }
      })
      .catch((e) => {
        setIsMermaidSyntaxValid(false);
        console.debug(e);
        setMermaidText(fallbackText);
      });
  };

  const resetMermaid = () => {
    document.querySelectorAll(`.mermaid${room.id}`).forEach((el) => {
      el.removeAttribute("data-processed");
    });
    mermaid.initialize({ startOnLoad: false });
    if (isMermaidSyntaxValid) {
      mermaid.run({querySelector: `.mermaid${room.id}`}).then(() => {
        console.debug("Rendering mermaid diagram");
      });
    }
  };

  useEffect(() => {
    handleMermaidTextChange();
  }, [editorText]);

  useEffect(() => {
    resetMermaid();
  }, [mermaidText]);

  return (
    <div className={styles.container}>
      {provider ? <Cursors yProvider={provider} /> : null}
      <div className={styles.editorHeader}>
        <div>{editorRef ? <Toolbar editor={editorRef} onCopy={() => {
          navigator.clipboard.writeText(editorRef.getValue());
        }} /> : null}</div>
        <Avatars />
      </div>
      <div className={styles.workArea}>
        <div className={styles.editorContainer}>
          <Editor
            onMount={handleOnMount}
            height="100%"
            width="100hw"
            theme="vs-light"
            defaultLanguage="markdown"
            defaultValue=""
            options={{
              tabSize: 2,
              padding: { top: 20 },
            }}
          />
        </div>
        <div className={styles.mermaidContainer}>
          <div className={styles.chipContainer}>
            {mermaidText.length > 0 && (
              <span
                className={
                  isMermaidSyntaxValid ? styles.validChip : styles.invalidChip
                }
              >
                {isMermaidSyntaxValid
                  ? "syntax is valid"
                  : "syntax is invalid, showing latest valid diagram"}
              </span>
            )}
          </div>

          <div className={styles.mermaidDiagramContainer}>
            <pre className={`mermaid${room.id}`}>{mermaidText}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
