from setuptools import setup, find_packages

setup(
    name="mytest",
    version="1.0",
    author="morris",
    author_email="morris881961@gmail.com",
    description="Testing setup",

    # 你要安装的包，通过 setuptools.find_packages 找到当前目录下有哪些包
    packages=find_packages(),
    install_requires=[
        'allennlp==0.9.0',
        'transformers>=2.3.0,<3.0.0',
    ],

)