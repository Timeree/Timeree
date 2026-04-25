#!/usr/bin/env bash

(
  set -eux

  cd ~ || exit

  if [ -d "$HOME/Timeree" ]; then
    cd "$HOME/Timeree" && git pull --ff-only
  else
    git clone https://github.com/Timeree/Timeree.git "$HOME/Timeree"
  fi

  echo 'export PATH="$PATH:$HOME/Timeree/tools"' > "$PREFIX/etc/profile.d/timeree.sh"
  
  chmod 644 "$PREFIX/etc/profile.d/timeree.sh"

  source $PREFIX/etc/profile.d/timeree.sh
  
)

# curl -fsSL https://raw.githubusercontent.com/Timeree/Timeree/main/install.sh
