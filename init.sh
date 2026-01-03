#!/usr/bin/env bash

(
  cd ~

  git clone https://github.com/Timeree/Timeree.git

  echo 'export PATH=${PATH}:~/Timeree/tools' >> ~/.bashrc
  
  echo "source ~/.bashrc"
)

# curl -fsSL https://raw.githubusercontent.com/Timeree/Timeree/main/init.sh | bash

