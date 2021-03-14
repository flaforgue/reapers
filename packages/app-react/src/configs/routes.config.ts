import React from 'react';
import { Home, Play } from '../components/pages';

type Route = 'home' | 'play';

type AppRouteProps = {
  path: string;
  label: string;
  component: React.FC;
  exact?: boolean;
  isHidden?: boolean;
};

export const routes: Record<Route, AppRouteProps> = {
  home: {
    path: '/',
    label: 'Home',
    component: Home,
    exact: true,
  },

  play: {
    path: '/play',
    label: 'Play',
    component: Play,
    exact: true,
    isHidden: true,
  },
};

export const visibleRoutes = Object.values(routes).filter(({ isHidden }) => !isHidden);
