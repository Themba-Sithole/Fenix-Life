import { createBrowserRouter } from "react-router";
import MainMenu from "./screens/MainMenu";
import CharacterCreation from "./screens/CharacterCreation";
import HomeScreen from "./screens/HomeScreen";
import CityMap from "./screens/CityMap";
import Smartphone from "./screens/Smartphone";
import BankingDashboard from "./screens/BankingDashboard";
import CompanyDashboard from "./screens/CompanyDashboard";
import EmployeeManagement from "./screens/EmployeeManagement";
import StockMarket from "./screens/StockMarket";
import RealEstate from "./screens/RealEstate";
import VehicleDealership from "./screens/VehicleDealership";
import Education from "./screens/Education";
import Family from "./screens/Family";
import Timeline from "./screens/Timeline";
import NewsFeed from "./screens/NewsFeed";
import Settings from "./screens/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainMenu,
  },
  {
    path: "/character-creation",
    Component: CharacterCreation,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/city",
    Component: CityMap,
  },
  {
    path: "/phone",
    Component: Smartphone,
  },
  {
    path: "/banking",
    Component: BankingDashboard,
  },
  {
    path: "/company",
    Component: CompanyDashboard,
  },
  {
    path: "/employees",
    Component: EmployeeManagement,
  },
  {
    path: "/stocks",
    Component: StockMarket,
  },
  {
    path: "/real-estate",
    Component: RealEstate,
  },
  {
    path: "/vehicles",
    Component: VehicleDealership,
  },
  {
    path: "/education",
    Component: Education,
  },
  {
    path: "/family",
    Component: Family,
  },
  {
    path: "/timeline",
    Component: Timeline,
  },
  {
    path: "/news",
    Component: NewsFeed,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);
