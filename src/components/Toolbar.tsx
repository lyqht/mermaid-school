import { SVGProps } from "react";
import styles from "./Toolbar.module.css";
import { editor } from "monaco-editor";

type Props = {
  editor: editor.IStandaloneCodeEditor;
  onCopy: () => void;
};

export function Toolbar({ editor, onCopy }: Props) {
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        onClick={() => editor.trigger("", "undo", null)}
        aria-label="undo"
      >
        <UndoIcon />
      </button>
      <button
        className={styles.button}
        onClick={() => editor.trigger("", "redo", null)}
        aria-label="redo"
      >
        <RedoIcon />
      </button>
      <button
        className={styles.button}
        onClick={onCopy}
        aria-label="redo"
      >
        <CopyIcon />
      </button>
    </div>
  );
}

export function UndoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6h6a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8.91"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M5.5 3.5 3 6l2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function RedoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6H6a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h1.09"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M10.5 3.5 13 6l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18H9Zm0-2h9V4H9v12Zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2H5Zm4-6V4v12Z"
      ></path>
    </svg>
  );
}
