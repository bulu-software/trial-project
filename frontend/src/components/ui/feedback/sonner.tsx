import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, InformationCircleIcon, Alert02Icon, MultiplicationSignCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
        ),
        info: (
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />
        ),
        error: (
          <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "#10b981",
          "--normal-text": "#0a0a0a",
          "--normal-border": "#10b981",
          "--success-bg": "#10b981",
          "--success-text": "#0a0a0a",
          "--success-border": "#10b981",
          "--border-radius": "9999px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast opacity-100 backdrop-blur-none shadow-lg shadow-black/30 font-semibold",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }