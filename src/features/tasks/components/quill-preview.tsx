"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";

interface PreviewProps {
  value: string |  undefined;
}

export const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill-new"), { ssr: false }), []);

  if (!value) {
    return (
      <p className='text-muted-foreground'>
        Nenhuma descrição.
      </p>
    )
  }

  return (
    <div>
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly
      />
    </div>
  );
};