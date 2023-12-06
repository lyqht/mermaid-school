"use client";

import { Room } from "@/app/Room";
import { CollaborativeEditor } from "./CollaborativeEditor";
import styles from "./CollaborativeEditors.module.css";
import { useState } from "react";

const MAX_CONCURRENT_EDITORS = 4;
const RoomWithEditor = ({ roomId }: { roomId: string }) => (
  <Room roomId={roomId}>
    <CollaborativeEditor />
  </Room>
);
export function CollaborativeEditors() {
  const [numRooms, setNumRooms] = useState(1);
  const addRoom = () => {
    setNumRooms(numRooms + 1);
  };

  return (
    <div className={styles.container}>
      {Array(numRooms).fill(null).map((_, index) => 
        <RoomWithEditor key={`workarea-${index}`} roomId={String(index + 1)} />
      )}
      {numRooms < MAX_CONCURRENT_EDITORS && (
        <button onClick={addRoom}>+ Add a new diagram</button>
      )}
    </div>
  );
}
