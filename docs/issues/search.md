# Search and discovery

Search is an extractor operation, not a playback operation. A playback fix or a
WebView update should not be assumed to fix an empty search result.

Search also has several distinct symptoms. Choose the description that matches:

- the request fails with an error;
- results are empty for an ordinary public query;
- results are present but an expected item is missing;
- results are in an unexpected language/country;
- only a filter, tab, or continuation is wrong.

The last two can be service-result or localization problems, not failures to
send the search request.

## Before reporting

Test one simple, public query and record:

- the service you searched (YouTube, BiliBili, NicoNico, or another service);
- the exact query and one expected result;
- the default content country;
- the selected YouTube extraction endpoint when searching YouTube;
- login state, experimental-new-UI state, and VPN/proxy state.

Attach the generated error report if PipePipe offers one. If the search works
only sometimes, include the approximate time and whether results are empty,
unrelated, or partially missing.

For a missing expected item, include a direct public URL to that item and say
whether opening the channel/page directly works. For an unexpected-language
result, record the app language and Android language as well as content country.
For a filter/tab problem, record the selected filter and whether it was changed
before or after running the query.

## One query, one comparison

Do not test with a long private query or a changing trend page. Use a concise
public phrase, copy it exactly into the report, and identify one expected public
result. If you compare endpoint or network, change only one at a time and keep
the service/query/country fixed.

## Keep it separate

Do not append a search complaint to a playback or WebView issue. The maintainer
needs to inspect a different request and a different response path.

## Search report template

```text
Service and exact query:
Expected public result (URL if possible):
Observed result (empty / missing / wrong / error):
PipePipe version / Android version:
Content country / app language / Android language:
YouTube endpoint, login, experimental UI, VPN or proxy state:
Time of the test and generated error report:
```
