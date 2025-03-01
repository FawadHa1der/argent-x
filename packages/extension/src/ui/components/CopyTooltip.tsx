import Tippy from "@tippyjs/react"
import { FC, ReactNode, useEffect, useRef, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import styled from "styled-components"

export const Tooltip = styled.span`
  background: #ffffff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  color: black;
  padding: 5px 10px;
  max-width: 300px;
  text-align: center;
`

interface CopyTooltipProps {
  copyValue: string
  message: string
  autoDismiss?: boolean
  children: ReactNode
}

export const CopyTooltip: FC<CopyTooltipProps> = ({
  copyValue,
  message,
  autoDismiss = true,
  children,
}) => {
  const [visible, setVisible] = useState(false)
  const pidRef = useRef<any>()

  useEffect(() => {
    if (autoDismiss && visible) {
      pidRef.current = setTimeout(() => setVisible(false), 2500)
    }
    return () => {
      clearTimeout(pidRef.current)
    }
  }, [autoDismiss, visible])

  return (
    <Tippy
      visible={visible}
      content={<Tooltip>{message}</Tooltip>}
      onClickOutside={() => {
        if (pidRef.current) {
          clearTimeout(pidRef.current)
        }
        setVisible(false)
      }}
    >
      <div>
        <CopyToClipboard text={copyValue} onCopy={() => setVisible(true)}>
          {children}
        </CopyToClipboard>
      </div>
    </Tippy>
  )
}
