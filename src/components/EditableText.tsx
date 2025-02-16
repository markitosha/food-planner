'use client';

import { TextArea } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';

export default function EditableText({
  children,
  onBlur
}: {
  children: string | number;
  onBlur?: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  if (editing) {
    return (
      <TextArea
        ref={inputRef}
        defaultValue={children.toString()}
        onBlur={(event) => {
          onBlur?.(event.target.value);
          setEditing(false)
        }}
      />
    );
  }

  return (
    <span
      onClick={() => {
        setEditing(true);
      }}
    >
      {children}
    </span>
  );
}
