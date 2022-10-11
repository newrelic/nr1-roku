[![New Relic One Catalog Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/New_Relic_One_Catalog_Project.png)](https://opensource.newrelic.com/oss-category/#new-relic-one-catalog-project)

# New Relic Roku HTTP Analytics

![CI](https://github.com/newrelic/nr1-roku/workflows/CI/badge.svg) ![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr1-roku?include_prereleases&sort=semver) [![Snyk](https://snyk.io/test/github/newrelic/nr1-roku/badge.svg)](https://snyk.io/test/github/newrelic/nr1-roku)

The New Relic [Roku observability agent](https://newrelic.com/instant-observability/roku) monitors the system- and video- level performance of Roku over the top (OTT) streaming applications and devices. Specifically, the agent offers insights into an application’s network connectivity, viewer journey, and overall functionality. 

To enhance the experience of the agent, the HTTP Analytics UI will allow you profile and analyze your HTTP errors and durations of requests made by your Roku channel to your backend. Read on to learn how to use the UI!

## Landing Page

You can access the UI by navigating to your Roku System entity types in the [entity explorer](https://docs.newrelic.com/docs/new-relic-solutions/new-relic-one/core-concepts/new-relic-explorer-view-performance-across-apps-services-hosts/).

Once in the entity, access your HTTP Analytics pages by naviating to them on the left nav bar.

>![Nav Bar](./screenshots/1-landing-page.png)

The Error Analytics and HTTP Analytics tabs will contain key metrics for profiling the networking behavior of your Roku app.

## Filter Bar

The top bar contains Grouping and Filtering capabilities.

>![Filter Bar](./screenshots/2-filter-bar-callout.png)

### Grouping
The Group By box allows you to group the metrics on-screen by the 6 most common attributes used to analyze Roku HTTP data:

- Domain
- Country Code
- Status
- Device Model
- HTTP Method
- HTTP Response Code

>![Group By](./screenshots/3-group-function.png)

### Filtering
The Filter By box allows you to search for and select any attribute value to filter the entire dashboard.

You can begin by clicking the box to select an attribute and clicking the value you want to filter to.
>![Filter By](./screenshots/4-fiter-one-value.png)

You can also begin by typing the name of the attribute you're looking for:
>![Filter Search](./screenshots/5-filter-type-search-key.png)

If the attribute has a lot of possible values, you can search those as well by using the search bar inside of the dropdown. This is useful for cases like drilling into a specific device model or even UUID:
>![Value Search](./screenshots/6-filter-type-search-value.png)

If the attribute represents a range (typical examples are timing data or response codes), you can define a range in the search:
>![Range Search](./screenshots/7-filter-type-search-value-range.png)

## Open source license

This project is distributed under the [Apache 2 license](LICENSE).

## Install using New Relic One Application Catalog

This application is primarily designed to be installed via the New Relic Application Catalog.

In [New Relic One](https://one.newrelic.com), navigate to your Apps section and click the Roku HTTP Analytics application. The Manage Access button in the top right will let you choose the account where you want to make this app visible. It will be visible to all users of that account.

## Install using New Relic One CLI

Roku HTTP Analytics is also an Open Source application. You can quickly and easily deploy it manually using the New Relic One CLI.

Ensure you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [npm](https://www.npmjs.com/get-npm) installed. If you're unsure whether you have them installed, run the following commands (they'll return version numbers if they're installed):

```bash
git --version
npm -v
```

Install the [New Relic One CLI](https://one.newrelic.com/launcher/developer-center.launcher). Follow the instructions to set up your New Relic development environment

```bash
git clone https://github.com/newrelic/nr1-roku.git
cd nr1-roku
npm install
nr1 nerdpack:uuid -gf
nr1 nerdpack:publish
nr1 nerdpack:subscribe  -C STABLE
```
This last command will subscribe the application to the account you've set as your default profile. You can check this using `nr1 profiles:default`. If you're not ready to deploy it to your account or want to test out changes you've made locally you can use:

```bash
git clone https://github.com/newrelic/nr1-roku.git
cd nr1-roku
npm install
** Make Any Desired Changes **
nr1 nerdpack:uuid -gf
nr1 nerdpack:serve
```

# Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

## Community

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

[https://discuss.newrelic.com/](https://discuss.newrelic.com/)

## Issues / enhancement requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](https://github.com/newrelic/nr1-roku/issues). Please search for and review the existing open issues before submitting a new issue.

## Security
This project adheres to the New Relic [security policy](https://github.com/newrelic/nr1-roku/security/policy).

# Contributing

Contributions are encouraged! If you submit an enhancement request, we'll invite you to contribute the change yourself. Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource+nr1-roku@newrelic.com
