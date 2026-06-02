export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main id='center'> {children}</main>;
}
