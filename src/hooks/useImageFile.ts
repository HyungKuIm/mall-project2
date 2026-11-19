import { useEffect, useRef, useState, type ChangeEvent } from 'react'

// 선택한 이미지 파일 + 미리보기 URL (파일 변경 시 이전 URL 해제, 화면 이탈 시 해제)
export function useImageFile() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const previewRef = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = next ? URL.createObjectURL(next) : null
    setFile(next)
    setPreview(previewRef.current)
  }

  return { file, preview, onChange }
}
