# -*- coding: utf-8 -*- #
# Copyright 2023 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Apphub Discovered Services API."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from apitools.base.py import list_pager
from googlecloudsdk.api_lib.apphub import utils as api_lib_utils


class DiscoveredServicesClient(object):
  """Client for services in apphub API."""

  def __init__(self, client=None, messages=None):
    self.client = client or api_lib_utils.GetClientInstance()
    self.messages = messages or api_lib_utils.GetMessagesModule()
    self._dis_services_client = (
        self.client.projects_locations_discoveredServices
    )

  def Describe(self, discovered_service):
    """Describe a Discovered Service in the Project/location.

    Args:
      discovered_service: str, the name for the discovered service being
        described.

    Returns:
      Described discovered service Resource.
    """
    describe_req = (
        self.messages.ApphubProjectsLocationsDiscoveredServicesGetRequest(
            name=discovered_service
        )
    )
    return self._dis_services_client.Get(describe_req)

  def List(
      self,
      parent,
      limit=None,
      page_size=100,
  ):
    """List discovered services in the Projects/Location.

    Args:
      parent: str, projects/{projectId}/locations/{location}
      limit: int or None, the total number of results to return. Default value
        is None
      page_size: int, the number of entries in each batch (affects requests
        made, but not the yielded results). Default value is 100.

    Returns:
      Generator of matching discovered services.
    """
    list_req = (
        self.messages.ApphubProjectsLocationsDiscoveredServicesListRequest(
            parent=parent
        )
    )
    return list_pager.YieldFromList(
        self._dis_services_client,
        list_req,
        field='discoveredServices',
        batch_size=page_size,
        limit=limit,
        batch_size_attribute='pageSize',
    )

  def FindUnregistered(
      self,
      parent,
      limit=None,
      page_size=100,
  ):
    """List unregistered discovered services in the Projects/Location.

    Args:
      parent: str, projects/{projectId}/locations/{location}
      limit: int or None, the total number of results to return. Default value
        is None
      page_size: int, the number of entries in each batch (affects requests
        made, but not the yielded results). Default value is 100.

    Returns:
      Generator of matching discovered services.
    """
    find_unregistered_req = self.messages.ApphubProjectsLocationsDiscoveredServicesFindUnregisteredRequest(
        parent=parent
    )
    return list_pager.YieldFromList(
        self._dis_services_client,
        find_unregistered_req,
        method='FindUnregistered',
        field='discoveredServices',
        batch_size=page_size,
        limit=limit,
        batch_size_attribute='pageSize',
    )

  def Find(
      self,
      parent,
      limit=None,
      page_size=100,
  ):
    """Find discovered services that could be added to an application in the Projects/Location.

    Args:
      parent: str, projects/{projectId}/locations/{location}
      limit: int or None, the total number of results to return. Default value
        is None
      page_size: int, the number of entries in each batch (affects requests
        made, but not the yielded results). Default value is 100.

    Returns:
      Generator of matching discovered services.
    """
    find_discovered_req = (
        self.messages.ApphubProjectsLocationsDiscoveredServicesFindRequest(
            parent=parent
        )
    )
    return list_pager.YieldFromList(
        self._dis_services_client,
        find_discovered_req,
        method='Find',
        field='discoveredServices',
        batch_size=page_size,
        limit=limit,
        batch_size_attribute='pageSize',
    )