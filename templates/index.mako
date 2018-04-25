<%! from templates.utils import player_compatible, count_format %>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />

<%block name="head">
<title>Главная страница | ${config['title']}</title>
</%block>

<%block name="content">
<h1>Архив чата BlackUFA_Twitch</h1>

<p>
Этот сайт (и соответствующий ему репозиторий) содержит архив чата Twitch-канала
<a href="https://www.twitch.tv/blackufa_twitch/">BlackUFA_Twitch</a>. Чат хранится
в виде субтитров формата ASS, что позволяет накладывать сообщения поверх видео в
практически любом плеере.
</p>

<p>
Архив также содержит ссылки на постоянные записи с возможностью онлайн просмотра.
Встроенный плеер <a href="https://github.com/sampotts/plyr">Plyr</a> не только
поддерживает воспроизведение видео с YouTube и из других источников, но и
автоматически накладывает соответствующие субтитры с помощью очень быстрого движка
<a href="https://github.com/Dador/JavascriptSubtitlesOctopus">Subtitles Octopus</a>.
</p>

% for category in categories:
  ## Заголовок категории
  <%el:header level="${category['level']}">
    ${category['name']}
  </%el:header>

  ## Описание категории
  % if category.get('description'):
    <p>${category['description']}</p>
  % endif

  <ul>
  % if category.get('type') is None:
    % for game in sorted(category['games'], key=lambda k: k['name']):
    <li>
      <%el:game_link game="${game}" /> (${count_format(len(game['streams']))})
    </li>
    % endfor
  % elif category['type'] == 'list':
    % for stream in category['games'][0]['streams']:
    <li>
      <%el:stream_link game="${category['games'][0]}" stream="${stream}" />
    </li>
    % endfor
  % endif
  </ul>

% endfor

<hr>

<h2>Стримы без записей</h2>

<p>
Если у вас есть ссылка на запись любого из этих стримов, сообщите мне через раздел
<a href="https://github.com/TheDrHax/BlackSilverUfa/issues/">Issues</a> этого репозитория.
Поддерживаются любые видео с YouTube или из ВКонтакте. Спасибо!
</p>

<ul>
<% missing = False %>\
% for game in games:
  % for stream in game['streams']:
    % if not player_compatible(stream):
<% missing = True %>\
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
    % endif
  % endfor
% endfor
% if not missing:
<li>Все записи на месте. Отлично! :)</li>
% endif
</ul>

<h3>Записи из ВКонтакте</h3>

<p>
Перечисленные ниже стримы используют ВКонтакте как источник видео. Mail.Ru активно
<a href="https://vk.com/blacksilverufa?w=wall140277504_139931">ставит палки в колёса</a>
тем, кто не хочет смотреть видео у них на сайте, поэтому эти записи могут работать нестабильно.
</p>

<ul>
% for game in games:
  % for stream in game['streams']:
    % if 'vk' in stream:
    <li>
      <%el:game_link game="${game}" /> —\
      <%el:stream_link game="${game}" stream="${stream}" />
    </li>
    % endif
  % endfor
% endfor
</ul>

</%block>
