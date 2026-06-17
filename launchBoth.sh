#!/bin/bash
npm start &
cd ./my-react-app && npm run dev -- --host 0.0.0.0 --port 3001 &
wait