'use client';

import { TextArea } from '@radix-ui/themes';
import { ReactNode, useEffect, useRef, useState } from 'react';

function EmptyWrapper({ children }: { children: string }) {
  return <>{children}</>;
}

export default function EditableText({
  Wrapper = EmptyWrapper,
  children,
  onBlur
}: {
  Wrapper?: ({ children }: { children: string }) => ReactNode;
  children: string;
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
        defaultValue={children}
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
      <Wrapper>{children}</Wrapper>
    </span>
  );
}
