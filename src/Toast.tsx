export default function Toast({
  type = "default",
  icon,
  title,
  content = "",
  isVisible = true,
}: {
  type?: "success" | "info" | "warning" | "error" | "default";
  icon: string;
  title: string;
  content?: string;
  isVisible?: boolean;
}) {
  const animationClass = isVisible
    ? "animate-enter transition-opacity opacity-100"
    : "animate-leave transition-opacity opacity-0";

  const alertTypeClass = {
    success: "alert-success",
    info: "alert-info",
    warning: "alert-warning",
    error: "alert-error",
    default: "",
  }[type];

  return (
    <div
      className={`alert ${alertTypeClass} ${animationClass} max-w-xs shadow-lg`}
    >
      <div className="flex items-start">
        <div>{icon}</div>
        <div className="text-left">
          <h3 className="font-bold">{title}</h3>
          {content ? (
            <div className="whitespace-pre-line text-xs">{content}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
