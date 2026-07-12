import { Navigate, createBrowserRouter } from "react-router";
import type { ComponentType } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootLayout } from "./layouts/RootLayout";
import MainMenu from "./screens/MainMenu";
import AuthScreen from "./screens/AuthScreen";
import ContinueScreen from "./screens/ContinueScreen";
import CharacterCreation from "./screens/CharacterCreation";
import ChildhoodSummaryScreen from "./screens/ChildhoodSummaryScreen";
import ChildhoodPlayScreen from "./screens/ChildhoodPlayScreen";
import CareerScreen from "./screens/CareerScreen";
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

function protect(Component: ComponentType) {
  return function ProtectedScreen() {
    return (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    );
  };
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
  {
    path: "/",
    Component: MainMenu,
  },
  {
    path: "/login",
    Component: AuthScreen,
  },
  {
    path: "/auth",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/continue",
    Component: protect(ContinueScreen),
  },
  {
    path: "/character-creation",
    Component: protect(CharacterCreation),
  },
  {
    path: "/childhood-play",
    Component: protect(ChildhoodPlayScreen),
  },
  {
    path: "/childhood-summary",
    Component: protect(ChildhoodSummaryScreen),
  },
  {
    path: "/home",
    Component: protect(HomeScreen),
  },
  {
    path: "/city",
    Component: protect(CityMap),
  },
  {
    path: "/phone",
    Component: protect(Smartphone),
  },
  {
    path: "/banking",
    Component: protect(BankingDashboard),
  },
  {
    path: "/company",
    Component: protect(CompanyDashboard),
  },
  {
    path: "/employees",
    Component: protect(EmployeeManagement),
  },
  {
    path: "/stocks",
    Component: protect(StockMarket),
  },
  {
    path: "/real-estate",
    Component: protect(RealEstate),
  },
  {
    path: "/vehicles",
    Component: protect(VehicleDealership),
  },
  {
    path: "/education",
    Component: protect(Education),
  },
  {
    path: "/career",
    Component: protect(CareerScreen),
  },
  {
    path: "/family",
    Component: protect(Family),
  },
  {
    path: "/timeline",
    Component: protect(Timeline),
  },
  {
    path: "/news",
    Component: protect(NewsFeed),
  },
  {
    path: "/settings",
    Component: protect(Settings),
  },
    ],
  },
]);
