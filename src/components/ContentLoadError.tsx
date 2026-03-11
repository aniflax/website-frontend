type ContentLoadErrorProps = {
  message?: string;
};

const ContentLoadError = ({
  message = "We could not load content from the CMS. Please try again in a moment.",
}: ContentLoadErrorProps) => (
  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
    {message}
  </div>
);

export default ContentLoadError;
