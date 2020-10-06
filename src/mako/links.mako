<%!
  import datetime
  from babel.dates import format_date
  from src.utils import md5file
  from src.data.streams import StreamType
  from src.data.timecodes import Timecode, Timecodes
%>
<%inherit file="include/base.mako" />
<%namespace file="include/elements.mako" name="el" />

<%block name="head">
<title>${game.name} | ${config['title']}</title>
</%block>

<%block name="content">
<%def name="timecode_link(t)">\
% if t.duration:
<%
    duration = t.duration
    t = Timecode(t)
    t.duration = None
%>\
${timecode_link(t)} - ${timecode_link(t + duration)}\
% else:
<a data-value="${int(t)}">${str(t)}</a>\
% endif
</%def>

<%def name="timecode_list(timecodes, text='Таймкоды')">\
% if len(timecodes) > 0:
  <li>${text}:</li>
  <ul>
  % for t in timecodes:
    % if isinstance(t, Timecodes) and not t.is_list:
    ${timecode_list(t, text=t.name)}
    % elif isinstance(t, Timecodes) and t.is_list:
    <li>
      % for i, t1 in enumerate(t):
      ${timecode_link(t1)}${',' if i != len(t) - 1 else ''}
      % endfor
      — ${t.name}
    </li>
    % else:
    <li>${timecode_link(t)} — ${t.name}</li>
    % endif
  % endfor
  </ul>
% endif
</%def>

<%def name="gen_segment(id, segment)">
<% hash = segment.hash %>\
<div class="d-flex" style="flex-wrap: wrap;">
  <div class="">
    <h2 id="${hash}">
      <a onclick="window.location.hash = '#${hash}'; return false;" href="/r/?${hash}">${segment.name}</a>
    </h2>
  </div>
  <div class="badge-row">
    <span class="badge badge-light">
      ${format_date(segment.date, format='long', locale='ru')}
    </span>
    % if segment.stream.type is not StreamType.NO_CHAT:
      % for stream_id in segment.twitch.split(','):
    <span class="badge badge-primary">
      <a href="https://www.twitch.tv/videos/${stream_id}" target="_blank">
        <i class="fab fa-twitch"></i> ${stream_id}
      </a>
    </span>
      % endfor
    <span class="badge badge-secondary">
      <a href="${segment.subtitles}">
        <i class="fas fa-comments"></i> ${segment.stream.messages}
      </a>
    </span>
    % endif
    % if len(segment.vk) > 0:
      % for vk in segment.vk:
    <span class="badge badge-primary">
      <a href="https://vk.com/video${vk}" target="_blank">
        <i class="fab fa-vk"></i> ${vk}
      </a>
    </span>
      % endfor
    % endif
    % if segment.youtube:
    <span class="badge badge-${'warning' if not segment.official else 'success'}">
      <a href="https://www.youtube.com/watch?v=${segment.youtube}" target="_blank">
        <i class="fab fa-youtube"></i> ${segment.youtube}
      </a>
    </span>
    % elif segment.direct and not segment.torrent:
    <span class="badge badge-danger">
      <a href="${segment.direct}">
        <i class="fas fa-download"></i> скачать
      </a>
    </span>
    % endif
    % if segment.torrent:
    <span class="badge badge-danger">
      <a href="${segment.torrent}">
        <i class="fas fa-download"></i> торрент
      </a>
    </span>
    % endif
  </div>
</div>

<ul>
% if segment.note:
  <li>Примечание: ${segment.note}</li>
% endif
<% related = [(g, s) for g, s in segment.stream.games
                     if g is not game and s is not segment] %>\
% if len(related) > 0:
  <li>Связанные игры:</li>
  <ul>
    % for game_ref, segment_ref in related:
    <li><a href="${game_ref.filename}">${game_ref.name}</a> — <a href="${segment_ref.url}">${segment_ref.name}</a></li>
    % endfor
  </ul>
% endif
% if len(segment.timecodes) > 0:
  <div class="timecodes" data-id="${id}">
  ${timecode_list(segment.timecodes)}
  </div>
% endif
</ul>

<div class="video-row d-flex justify-content-center">
  <p class="stream" data-id="${id}" ${segment.attrs()} />
</div>

% if not segment.playable:
<p>Запись этого стрима в данный момент отсутствует. Если вы попали сюда по
прямой ссылке с YouTube, то это значит, что запись уже есть, но сайт ещё не
обновился. Обычно на это требуется минута или около того, но я оставляю
комментарий ещё до завершения процесса. Нажмите
<a href="#" onclick="document.location.reload(); return false;">сюда</a>, чтобы попробовать обновить
страницу.</p>
% endif

% if segment.playable:
<%el:code_block>\
mpv ${segment.mpv_args()} ${segment.mpv_file()}
</%el:code_block>
% endif
% if (not segment.playable or segment.direct) and segment.stream.type is StreamType.DEFAULT:
<%el:code_block>\
streamlink -p mpv -a "${segment.mpv_args()}" --player-passthrough hls twitch.tv/videos/${segment.twitch} best
</%el:code_block>
% endif

% if game.streams.index(segment) != len(game.streams) - 1:
<hr>
% endif
</%def>

<h1><a href="/">Архив</a> → ${game.name}</h1>
<% id = 0 %> \
% for segment in game.streams:
${gen_segment(id, segment)}
<% id += 1 %> \
% endfor
</%block>
