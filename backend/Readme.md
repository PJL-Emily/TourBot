**[How to install right environment with pipenv]**
1. Run "pipenv --rm" if you have created any virtualenvs.
2. Remove any Pipfile and Pipfile.lock under your home directory, except the one under backend.
3. Run "cd" to backend run "pipenv --three", you will get a virtualenv whose name is "backend".
4. Still under backend, run "pipenv install" and wait a while, uh... maybe 10 minutes or more, until it says it success.

**Attention : you can not cd to other directory when running command under! pipenv is directory-wise, i.e. there will be another virtualenv if you cd to other directory!**

**[How to install package]**
- Use "pipenv install xxx", where "xxx" is the package name.

**[How to run python]**
- Use "pipenv run python xxx.py" to run the code.

**[Tips]**
- Try not to use "pipenv shell", it may cause some unexpected error.
- See "pipenv run" as you are in that virtualenv, i.e. you can run command like "pipenv run pip freeze", "pipenv run pip list"...etc.
- Just don't use "pipenv run pip install", the package you install will not show in Pipfile.
- If you have any question, feel free to ask me.