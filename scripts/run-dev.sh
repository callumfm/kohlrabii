#!/bin/bash

tmux new-session -d -s dev
tmux split-window -h

tmux send-keys -t dev.0 "cd backend && docker compose --env-file .env.local down -v --remove-orphans && docker compose --env-file .env.local watch" C-m
tmux send-keys -t dev.1 "cd frontend && npm run dev" C-m

tmux attach-session -t dev
