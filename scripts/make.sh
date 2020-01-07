# Require: GitHub[User/Email/Key]
# Repo/Branch
#NOTE: Key is GitHub API Personal Access Key

gitConfig() {
  git config --global push.default matching
  git config --global user.name "$1"
  git config --global user.email "$2"
}

gitInitPull() {
  git init
  git remote add origin https://$3@github.com/$1
  git pull origin $2
}

gitPushPwdToBranch() {
  git add --all .
  git commit -m "$2"
  git push --quiet --force origin HEAD:$1
}

# Run build in build/, move results back
deploy() {
  mkdir build; pushd build
  gitConfig ${GitHubUser} ${GitHubEmail}
  runBuild
  mv dist/ ..
  popd; rm -rf build
  gitInitPull ${Repo} ${Branch} ${GitHubKey}
  gitPushPwdToBranch ${Branch} "Automatic Build by Travis CI"
}

runBuild() {
  pushd ..
  tsc; webpack
  mv dist/ build/
  popd
}
