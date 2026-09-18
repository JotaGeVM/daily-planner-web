import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="nav-bar">
      <NavLink
        to="/tarefas"
        className={({ isActive }) => (isActive ? "nav-ativo" : "")}
      >
        Hoje
      </NavLink>
      <NavLink
        to="/semana"
        className={({ isActive }) => (isActive ? "nav-ativo" : "")}
      >
        Semana
      </NavLink>
      <NavLink
        to="/mes"
        className={({ isActive }) => (isActive ? "nav-ativo" : "")}
      >
        Mês
      </NavLink>
    </nav>
  );
}
export default NavBar;
