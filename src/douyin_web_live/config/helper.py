from pathlib import Path
from ruamel import yaml
import sys
def config():
    settings_file = str(Path(__file__).parent.absolute()) + '/settings.yml'

    with open(settings_file, 'r') as f:
        file = yaml.load(f, Loader=yaml.UnsafeLoader)
        if sys.argv[1:]:
            file['live']['rooms'] = [sys.argv[1]]
        return file

