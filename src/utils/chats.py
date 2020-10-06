import os
import tcd
import requests

from . import _
from ..data.fallback import FallbackSource
from ..data import config, streams
from ..data.streams import StreamType
from ..data.config import tcd_config
from ..scripts.converter import convert_file


fallback = FallbackSource(**config['fallback'])


def download(stream):
    key = stream.twitch
    dest = stream.subtitles_path

    if fallback.chats and f'{key}.ass' in fallback:
        url = fallback.url(f'{key}.ass')

        print(f'Downloading chat {key} via fallback source')

        try:
            r = requests.get(url)

            with open(dest, 'wb') as of:
                for chunk in r.iter_content(chunk_size=1024):
                    of.write(chunk)
        except Exception as ex:
            os.unlink(dest)
            raise ex
    else:
        print(f'Downloading chat {key} via TCD')
        tcd_config['directory'] = os.path.dirname(dest)
        tcd_config['ssa_style_default'] = stream.subtitles_style.compile()
        tcd.settings.update(tcd_config)

        try:
            tcd.download(key)
        except Exception as ex:
            os.unlink(dest)
            raise ex

    convert_file(dest, style=stream.subtitles_style)


if __name__ == '__main__':
    # Create destination directory
    for dp in [_(''), _('chats')]:
        if not os.path.isdir(dp):
            os.mkdir(dp)

    # Download missing stream subtitles
    for key, stream in streams.items():
        if stream.type is StreamType.DEFAULT:
            if not os.path.isfile(stream.subtitles_path):
                download(stream)
