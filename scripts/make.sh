# Require: GitHub[User/Email/Key]
# Repo/Branch
#NOTE: Key means GitHub API Personal Access Key

gitConfig() { # (user, email)
  git config --global push.default matching
  git config --global user.name "$1"
  git config --global user.email "$2"
}

gitInitPull() { # (repo, branch, key)
  git init
  git remote add origin https://$3@github.com/$1
  git pull origin $2
}

gitPushPwdToBranch() { # (branch, message)
  git add --all .
  git commit -m "$2"
  git push --quiet --force origin HEAD:$1
}

# Run build in build/, move results back
deploy() {
  mkdir build; pushd build
  gitConfig ${GitHubUser} ${GitHubEmail}
  pushd ..; runBuildTo build; popd
  gitInitPull ${Repo} ${Branch} ${GitHubKey}
  gitPushPwdToBranch ${Branch} "Automatic build by Travis CI"
  popd; rm -rf build
}

runBuildTo() { # (destination)
  tsc; webpack
  mv dist/* $1
  mv *.md $1
}
