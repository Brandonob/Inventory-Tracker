'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkDatabaseConnection } from '../redux/slices/databaseSlice';

export function InitializeDB() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkDatabaseConnection());
  }, [dispatch]);

  return null;
}
