"""
This file contains a small subset of the tests we will run on your backend submission
"""

import unittest
import os
import testLib

class TestSmiles(testLib.SmileTestCase):

    ###
    ### THESE ARE THE ACTUAL TESTS
    ###
    def testAdd1(self):
        """
        Test adding one smile
        """
        respCreate = self.makeRequest("/api/smiles", method="POST",
                                    data = { 'title' : 'A shy smile',
                                             'space' : self.smileSpace,
                                             'story' : 'Once upon a time I was a shy boy...',
                                             'happiness_level' : 1,
                                             'like_count' : 0
                                             })
        self.assertSuccessResponse(respCreate)
        self.assertEquals(0, respCreate['smile']['like_count'])
        self.assertEquals('A shy smile', respCreate['smile']['title'])

        # Now read the smiles
        respGet = self.getSmiles(count='all')
        self.assertSuccessResponse(respGet)
        self.assertEquals(1, len(respGet['smiles']))
        self.assertEquals(respCreate['smile']['id'], respGet['smiles'][0]['id'])


