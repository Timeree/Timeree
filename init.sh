#!/usr/bin/env bash

(
  cd ~

  git clone https://github.com/Timeree/Timeree.git

  echo 'export PATH=${PATH}:~/Timeree/tools' >> ~/.bashrc
  
  source ~/.bashrc
  
)

# curl -sL https://raw.githubusercontent.com/Timeree/Timeree/main/init.sh | bash

