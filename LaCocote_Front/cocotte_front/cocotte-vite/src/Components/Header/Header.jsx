const Header = () => {
  return (
    <header className="main-header-container">
      <div className="nav-header">
        <div className="img-mini-cocotte">
          <img
            src="/src/img/mini-cocotte.png"
            className="img-mini-cocotte"
            alt=""
          />
        </div>
        <div className="nav-title">
          <img src="/src/img/logo_letras.png" className="nav-title" alt="" />
        </div>
        <div className="nav-notif"></div>
      </div>
    </header>
  );
};

export default Header;
