#!/usr/bin/env bash

(
  set -eux

  cd ~ || exit

  git clone https://github.com/Timeree/Timeree.git

  : 'export PATH="${PATH}:$HOME/Timeree/tools"' > "$PREFIX/etc/profile.d/timeree.sh"
  
  chmod 644 "$PREFIX/etc/profile.d/timeree.sh"

  source $PREFIX/etc/profile.d/timeree.sh
  
)
