'use client';

import { TextArea, TextField } from '@radix-ui/themes';
import { Ref, useEffect, useRef, useState } from 'react';

export default function EditableText({
  children,
  onBlur,
  type = 'textarea',
}: {
  children: string | number;
  onBlur?: (value: string) => void;
  type?: 'input' | 'textarea';
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  if (editing && type === 'textarea') {
    return (
      <TextArea
        ref={inputRef as Ref<HTMLTextAreaElement>}
        defaultValue={children.toString()}
        onBlur={(event) => {
          onBlur?.(event.target.value);
          setEditing(false);
        }}
      />
    );
  }

  if (editing && type === 'input') {
    return (
      <TextField.Root
        ref={inputRef as Ref<HTMLInputElement>}
        defaultValue={children.toString()}
        onBlur={(event) => {
          onBlur?.(event.target.value);
          setEditing(false);
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
