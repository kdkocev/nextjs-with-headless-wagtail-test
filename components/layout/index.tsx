const Layout: React.FC<{}> = ({ children }) => {
  return (
    <div>
      <div>Header placeholder</div>
      <div>{children}</div>
      <div>Footer placeholder</div>
    </div>
  );
};

export default Layout;
