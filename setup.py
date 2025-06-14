from setuptools import setup, find_packages

setup(
    name='customayp',
    version='0.0.1',
    description='Custom app for AYP',
    author='Your Name',
    author_email='your@email.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=['frappe'],
)
