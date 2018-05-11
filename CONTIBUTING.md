## Contributing

Create a new branch from an up to date master branch on your fork.

1. Fork the react-union repository on Github
2. Clone your fork to your local machine 
```sh
git clone git@github.com:<yourname>/react-union.git
```
3. Create a branch 
```sh
git checkout -b my-topic-branch`
```
4. Make your changes, lint, test, then push to to GitHub with `git push origin my-topic-branch`.
5. Visit GitHub and make your pull request.

For synchronizing master branch between fork and lundegaard repository:
```sh
git remote add upstream git@github.com:lundegaard/react-union.git
git checkout master
git fetch upstream
git merge upstream/master
```
